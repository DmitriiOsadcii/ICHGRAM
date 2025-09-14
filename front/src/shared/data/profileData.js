const profileData = {
    username: {
        type: "text",
        placeholder: "Username",
        name: "username",
        label: "Username",
        rules: {
            required: "Username is required",
            minLength: {
                value: 2,
                message: "Username must be at least 2 characters",
            },
            maxLength: {
                value: 20,
                message: "Username must be less than 20 characters",
            },
        },
    },
    fullName: {
        type: "text",
        placeholder: "Full Name",
        name: "fullName",
        label: "Full Name",
        rules: {
            required: "Full Name is required",
            minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
            },
            maxLength: {
                value: 50,
                message: "Name must be less than 50 characters",
            },
        },
    },
    website: {
        type: "url",
        placeholder: "Website",
        name: "website",
        label: "Website",
        rules: {
            pattern: {
                value:
                    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,63}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                message: "Website must be a valid URL",
            },
        },
    },
    biography: {
        type: "textarea",
        placeholder: "About you",
        name: "biography",
        label: "About",
        rules: {
            maxLength: {
                value: 150,
                message: "About must be less than 150 characters",
            },
        },
    },
};

export default profileData;