# Ory Kratos Admin Dashboard Requirements

## Core Requirements Summary
**Purpose**: Desktop web admin interface for Ory Kratos user identity management
**Primary Users**: System administrators managing user accounts
**Scope**: User CRUD operations, bulk CSV import, table-based data management

## Admin Operations Priority
1. **User Creation** - Individual user account creation with email/password
2. **User List** - Paginated table view of all users with filtering/search
3. **Bulk Operations** - CSV import for mass user creation
4. **User Management** - Edit, delete, view user details

## Integration Architecture
- **Existing Kratos Instance**: Running and accessible
- **API Strategy**: TBD - Direct calls vs Next.js proxy (see architecture notes)
- **Authentication**: Email/password for admin interface
- **Security**: Admin interface needs separate auth from managed users

## User Management Scope
### Data Display Fields
- **Email** - Primary identifier
- **Name** - Display name/full name
- **ID** - Kratos identity ID
- **Created At** - Account creation timestamp

### Schema Details
- **No Custom Schemas** - Using Kratos default identity schema
- **Standard Traits** - email, name fields from default schema
- **Future Extensibility** - Design to accommodate custom schemas later

### Bulk Operations
- **CSV Import Priority** - Focus on mass user creation first
- **CSV Format**: email, name, password (minimum viable)
- **Validation** - Email format, duplicate detection
- **Error Handling** - Failed imports with detailed feedback

## UI/UX Specifications
- **Layout**: Table-based data management interface
- **Styling**: Tailwind CSS utilities, no additional component libraries
- **Responsive**: Desktop-focused (no mobile optimization needed)
- **Navigation**: Simple sidebar or top nav for different admin functions
- **Interactions**: Row actions (edit, delete), bulk selection, sorting/filtering