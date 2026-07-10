export const buildWhatsAppLink = (
  phone?: string | null,
  message = "",
): string => {
  const encoded = encodeURIComponent(message || "");
  if (!phone) return `https://api.whatsapp.com/send?text=${encoded}`;

  const digits = phone.replace(/\D/g, "");
  let normalized = digits;

  normalized = normalized.replace(/^0+/, "");

  if (!normalized.startsWith("593")) {
    normalized = `593${normalized}`;
  }

  return `https://api.whatsapp.com/send?phone=${normalized}&text=${encoded}`;
};

export default buildWhatsAppLink;