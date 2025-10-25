export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "77000000000";
export const PHONE = process.env.NEXT_PUBLIC_PHONE || "77712374001";
export const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM || "https://www.instagram.com/elegance_autorent02";

export function waLink(text: string = "Здравствуйте! Интересует аренда авто.") {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export function telLink() {
  return `tel:+${PHONE}`;
}
