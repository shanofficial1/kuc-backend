const academicSectionNames =
  new Set([
    "academic",
    "academic_details"
  ]);

const isPlainObject = (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    value instanceof Date
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
};

export const isEmptyFileValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "undefined" ||
    value === "null"
  ) {
    return true;
  }

  if (
    isPlainObject(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }

  return false;
};

export const stripUndefinedDeep = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep);
  }

  if (
    isPlainObject(value)
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [
          key,
          stripUndefinedDeep(entryValue)
        ])
    );
  }

  return value;
};

export const sanitizeProfileSection = (
  sectionName,
  data = {}
) => {
  const sanitized =
    stripUndefinedDeep(data);

  if (
    academicSectionNames.has(sectionName) &&
    isEmptyFileValue(sanitized.fellowshipLetter)
  ) {
    delete sanitized.fellowshipLetter;
  }

  return sanitized;
};

export const sanitizeProfilePayload = (
  data = {}
) => {
  const sanitized =
    stripUndefinedDeep(data);

  if (sanitized.academic_details) {
    sanitized.academic_details =
      sanitizeProfileSection(
        "academic_details",
        sanitized.academic_details
      );
  }

  return sanitized;
};

export const setByDotPath = (
  target,
  path,
  value
) => {
  if (value === undefined) {
    return;
  }

  if (
    path === "academic_details.fellowshipLetter" &&
    isEmptyFileValue(value)
  ) {
    return;
  }

  const keys =
    path.split(".");

  let current =
    target;

  for (
    let i = 0;
    i < keys.length - 1;
    i++
  ) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }

    current =
      current[keys[i]];
  }

  current[keys[keys.length - 1]] =
    stripUndefinedDeep(value);
};

export const buildNestedObjectFromDotPaths = (
  dotPathValues = {}
) => {
  const nested = {};

  Object.entries(dotPathValues)
    .forEach(([path, value]) => {
      setByDotPath(
        nested,
        path,
        value
      );
    });

  return sanitizeProfilePayload(nested);
};
