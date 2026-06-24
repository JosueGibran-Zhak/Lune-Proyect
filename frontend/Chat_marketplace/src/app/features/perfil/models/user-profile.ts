export interface UserProfile {
    id: string;
    nombre: string;
    avatarUrl: string;

    telefono: string;
    instagram: string;
    facebook: string;
    tiktok: string;
}

export interface UserProfileRequest {
    telefono: string;
    instagram: string;
    facebook: string;
    tiktok: string;
}