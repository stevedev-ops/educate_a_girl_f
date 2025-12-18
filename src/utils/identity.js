export const getGuestId = () => {
    try {
        let guestId = localStorage.getItem('guest_uuid');
        if (!guestId) {
            // Generate a random UUID
            guestId = crypto.randomUUID ? crypto.randomUUID() : 'guest_' + Date.now() + Math.random().toString(36).slice(2);
            localStorage.setItem('guest_uuid', guestId);
        }
        return guestId;
    } catch (error) {
        console.error("Error accessing localStorage for identity:", error);
        // Fallback for getting something usable in memory if localStorage fails (e.g. private mode restrictions)
        return 'temp_guest_' + Date.now();
    }
};
