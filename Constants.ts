
export const TIME_SLOTS: string[] = Array.from({ length: (23 - 8) * 2 + 1 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${minute}`;
});

// For demonstration purposes, the password is hardcoded.
// In a real application, this should be handled securely.
export const PASSWORD = "salud"; 
