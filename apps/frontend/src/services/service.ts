export const getSecurityTip = async (): Promise<string> => {
  // Mock security tips - in production, this would call an actual AI service ----------- TODO
  const tips = [
    "Usá una contraseña única para cada cuenta para prevenir ataques de reutilización de credenciales.",
    "Habilitá la autenticación de dos factores siempre que sea posible para una capa adicional de seguridad.",
    "Tené cuidado con los intentos de phishing - siempre verificá el remitente antes de hacer clic en los enlaces.",
    "Usá un gestor de contraseñas para generar y almacenar contraseñas seguras y únicas.",
    "Revisá regularmente la actividad de tu cuenta y cerrá sesión en dispositivos o sesiones que no estés usando.",
  ];

  return tips[Math.floor(Math.random() * tips.length)];
};

export const getAIGreeting = async (name: string): Promise<string> => {
  // Mock AI greetings - in production, this would call an actual AI service ----------- TODO
  const greetings = [
    `Bienvenido/a ${name}. Tu panel de gestión de obras está listo.`,
    `Hola ${name}. Revisemos el avance y cumplimiento de tus proyectos.`,
    `${name}, accedé al seguimiento técnico de tus obras.`,
    `Bienvenido/a ${name}. Tenés el control de planificación y normativa en un solo lugar.`,
    `${name}, tus proyectos están listos para continuar su seguimiento.`,
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
};
