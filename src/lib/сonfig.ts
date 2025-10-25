export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "77000000000";

export function waLink(text: string = "Здравствуйте! Интересует аренда авто.") {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}
export const PHONE = process.env.NEXT_PUBLIC_PHONE || "77000000000";
