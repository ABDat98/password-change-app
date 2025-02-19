export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const response = await fetch('https://www.greatfrontend.com/api/projects/challenges/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: "1234",
            password: data.currentPassword,
            new_password: data.newPassword,
        }),
    });

    return response.json();
};
