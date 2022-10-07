type IconName =
  | "add"
  | "delete_forever"
  | "chevron_left"
  | "chevron_right"
  | "settings"
  | "dark_mode"
  | "delete"
  | "logout"
  | "alert"
  | "add_circle"
  | "category"
  | "library_add"
  | "layers"
  | "edit"
  | "remove"

export function Icon({ name }: { name: IconName }) {
  return <span className="icon material-symbols-outlined">{name}</span>
}
