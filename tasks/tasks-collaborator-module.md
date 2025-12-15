# Task List: Módulo de Cadastro de Colaborador

## Relevant Files

- `src/pages/CollaboratorForm.tsx` - ✅ Main form component for creating/editing collaborators with tabbed interface (6 tabs + history tab)
- `src/utils/storage.ts` - ✅ Storage utilities for managing collaborators in localStorage, includes Collaborator interface, CRUD operations, deletion validation, and project history tracking
- `src/utils/validation.ts` - ✅ Validation functions for CPF, email, and other fields
- `src/utils/project-storage.ts` - ✅ Storage utilities for managing projects with CRUD operations and collaborator relationship queries
- `src/components/ui/tabs.tsx` - ✅ Tab component from Shadcn UI for organizing form sections
- `src/components/ui/cpf-input.tsx` - ✅ Custom input component with CPF mask and validation
- `src/components/ui/rg-input.tsx` - ✅ Custom input component with RG mask
- `src/components/ui/cep-input.tsx` - ✅ Custom input component with CEP mask and automatic address lookup via ViaCEP API
- `src/components/ui/currency-input.tsx` - ✅ Custom input component with currency mask
- `src/components/ui/percentage-input.tsx` - ✅ Custom input component with percentage mask
- `src/components/ui/date-input.tsx` - ✅ Custom input component with date mask and native datepicker
- `src/components/ui/phone-input.tsx` - ✅ Custom input component with phone mask
- `src/pages/ProjectForm.tsx` - ✅ Project form that integrates with collaborators, supports custom costs per collaborator, saves/loads from storage, and updates collaborator history
- `src/pages/Dashboard.tsx` - ✅ Dashboard that loads projects and collaborators from storage dynamically

### Notes

- ✅ All PRD requirements have been implemented
- ✅ Project storage created and integrated
- ✅ History tracking UI implemented with salary and project history tables
- ✅ Custom cost per project feature fully implemented
- ✅ Deletion validation prevents deletion of collaborators in active projects
- ✅ All integrations between modules are working

## Tasks

- [x] 1.0 Complete Collaborator Form Implementation and Validation
  - [x] 1.1 Verify all required fields are properly validated (CPF, email, dates, etc.)
  - [x] 1.2 Ensure all masks are working correctly (phone, CPF, RG, CEP, currency, percentage, date)
  - [x] 1.3 Test CEP automatic address lookup functionality
  - [x] 1.4 Verify date validation (termination date not before admission date)
  - [x] 1.5 Ensure error messages are clear and contextual

- [x] 2.0 Implement Project History Tracking and Integration
  - [x] 2.1 Create project storage utility (`src/utils/project-storage.ts`) with Project interface and CRUD operations
  - [x] 2.2 Update ProjectForm to save/load projects from localStorage
  - [x] 2.3 Implement function to add project to collaborator's projectHistory when project is saved
  - [x] 2.4 Update collaborator's currentProject status when assigned to a project
  - [x] 2.5 Update collaborator's projectHistory when project status changes (active/completed)
  - [x] 2.6 Update Dashboard to load projects from storage instead of hardcoded data

- [x] 3.0 Implement Deletion Validation and Safety Checks
  - [x] 3.1 Create utility function to check if collaborator is in active projects
  - [x] 3.2 Update deleteCollaborator function to validate before deletion
  - [x] 3.3 Update CollaboratorForm delete dialog to show warning if collaborator is in active projects
  - [x] 3.4 Prevent deletion if collaborator has active projects (show list of active projects)
  - [x] 3.5 Allow deletion only if all projects are completed or collaborator is removed from active projects

- [x] 4.0 Create History Viewing Interface
  - [x] 4.1 Add new tab "Histórico" to CollaboratorForm for viewing history
  - [x] 4.2 Create component to display salary history (table with date, previous value, new value, reason)
  - [x] 4.3 Create component to display project history (table with project name, dates, hourly rate, hours worked)
  - [x] 4.4 Add visual indicators for history entries (icons, badges)
  - [ ] 4.5 Implement filtering/sorting options for history (optional enhancement)

- [x] 5.0 Implement Custom Cost Per Project Feature
  - [x] 5.1 Update Project interface to include collaborator-specific costs (collaboratorId -> hourlyRate mapping)
  - [x] 5.2 Modify ProjectForm to allow setting custom hourly rate for each selected collaborator
  - [x] 5.3 Display default hourly rate from collaborator profile with option to override
  - [x] 5.4 Update projectHistory to store the custom hourly rate used for that project
  - [x] 5.5 Calculate project total cost based on custom rates and hours worked

