// Avatars ship with the client (see public/avatars) so the app does not depend on an
// external CDN staying reachable.
export const avatars = Array.from(
    { length: 20 },
    (_, index) => `/avatars/avatar-${index + 1}.png`
);
