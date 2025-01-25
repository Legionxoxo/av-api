export interface UserDetails {
    id: string;
    email: string;
    name?:
        | string
        | {
              givenName?: string;
              familyName?: string;
          };
}

export interface SessionGetResponse {
    authenticated: boolean;
    user_details?: UserDetails;
    not_found?: boolean;
    expired?: boolean;
}
