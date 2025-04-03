import { createContext, useContext } from 'react';

interface AnimationTimingContextProps {
  textAnimationsComplete: boolean;
}

// Crear el contexto para controlar animaciones
const AnimationTimingContext = createContext<AnimationTimingContextProps>({
  textAnimationsComplete: false,
});

// Hook personalizado para consumir el contexto fácilmente
export const useAnimationTiming = () => useContext(AnimationTimingContext);

// Exportar el Provider para usarlo en MainLayout
export const AnimationTimingProvider = AnimationTimingContext.Provider;