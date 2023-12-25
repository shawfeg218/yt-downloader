import { create } from "zustand";

type SidebarStore = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const useSidebarStore = create<SidebarStore>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useSidebarStore;
