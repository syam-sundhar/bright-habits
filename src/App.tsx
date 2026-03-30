import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import { HabitDetailPage } from "./pages/HabitDetailPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useHabits } from "@/hooks/useHabits";
import { HabitsContext } from "@/context/HabitsContext";

const queryClient = new QueryClient();

function AppRoutes() {
  const habitsState = useHabits();

  return (
    <HabitsContext.Provider value={habitsState}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/habit/:id" element={
          <HabitDetailPage
            habits={habitsState.habits}
            today={habitsState.today}
            toggleHabit={habitsState.toggleHabit}
            toggleSubtask={habitsState.toggleSubtask}
            addSubtask={habitsState.addSubtask}
            deleteSubtask={habitsState.deleteSubtask}
          />
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HabitsContext.Provider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
