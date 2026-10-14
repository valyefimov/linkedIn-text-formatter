import { InstallButton } from "./InstallButton";
import styles from "./HeaderControls.module.css";
import { ThemeToggle } from "./ThemeToggle";

/** Fixed top-right controls shared by every page. */
export const HeaderControls = () => (
  <div className={styles.controls}>
    <InstallButton />
    <ThemeToggle />
  </div>
);
