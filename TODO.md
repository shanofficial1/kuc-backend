# TODO - Soft Delete for Dynamic Sections

- [x] Understand current profile update + admin approval flow.
- [ ] Update `controllers/studentProfile.controller.mjs`:

  - [ ] Accept and persist `changes.deletedRecords` inside the existing `ProfileUpdateRequest.changes` structure.
  - [ ] Update `approveRequest` to apply deletions to the correct array paths using section->dbPath mapping.
  - [ ] Validate section + objectId (ObjectId format + presence in student profile arrays).
  - [ ] Ensure deletions are applied alongside existing updatedFields/newRecords behavior.
  - [ ] Add audit entries for each deletion.
- [ ] Update `models/StudentProfile.mjs` to include an audit log field (if not already present).
- [ ] Add/extend helper functions in `utils/profileDataSanitizer.mjs` if needed for sanitizing `deletedRecords`.
- [ ] Add smoke tests / run server and manually verify:
  - [ ] Creating request with deletedRecords does NOT mutate profile until approve.
  - [ ] Approving request filters out removed items from arrays.
  - [ ] Invalid objectId / invalid section are rejected.

