export interface UserRequest {
    id?: number; // Optional for user creation, required for update
    username: string;
    email: string;
    password?: string; // Optional because password isn't updated here
    role?: string; // Optional because password isn't updated here
}
