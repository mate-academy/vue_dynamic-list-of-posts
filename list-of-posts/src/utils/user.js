export const setUser = (user) => {
	localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
	const user = localStorage.getItem("user");
	// Check if the user item exists before parsing
	return user ? JSON.parse(user) : null;
};

export const getUserId = () => {
	return getUser().id;
};

export const removeUser = () => {
	localStorage.removeItem("user");
};
