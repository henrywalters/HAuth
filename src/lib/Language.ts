enum Language {
    EMAIL_EXISTS = 'Email already exists',
    INVALID_PASSWORD = 'Password must be at least 8 characters long',
    GOOGLE_ACCOUNT_EXISTS = 'Google account already registered',
    ORGANIZATION_404 = 'Organization does not exist',
    INVALID_LOGIN = 'Invalid email / password',
    FAILED_REFRESH = 'Failed to refresh access token',
    USER_404 = 'User does not exist',
    USER_INVALID_DOMAIN = 'Email must be belong to organization domain',
    PRIVILEGE_EXISTS = 'Privilege with this name already exists',
    ROLE_EXISTS = 'Role with this name already exists',
    PRIVILEGE_LOCKED = 'Privilege is locked and can not be changed',
    ROLE_LOCKED = 'Role is locked and can not be changed',
    CANT_REMOVE_OWNER = 'Can not remove the owner from organization',
}

export default Language;