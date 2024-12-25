import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check");
            set({ authUser: res.data });
            toast.success("Signed Up Successfully");
            console.log("response is ", res.data);
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            // alert("error is checkAuth");
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out Successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.res.data.message);
        }
    },
    login: async (data) => {
        set({ isLoggingIng: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged In Successfully");
            // alert("Logged In Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.res.data.message);
        } finally {
            set({ isLoggingIng: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            set({ authUser: res.data.updateUser }); // Assuming the updated user is in res.data.updateUser
            toast.success("Profile updated successfully!");
        } catch (error) {
            const errorMessage = error?.response?.data?.msg || "An error occurred while updating the profile.";
            toast.error(errorMessage);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));