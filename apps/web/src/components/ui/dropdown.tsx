import { Button, type ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import clsx from "clsx";
import {
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOnClickOutside } from "usehooks-ts";

const hasKey = (
  event: KeyboardEvent<HTMLElement> | ReactMouseEvent<HTMLElement>,
): event is KeyboardEvent<HTMLElement> => Object.hasOwn(event, "key");

type DropdownProps = {
  id: string;
  control: ReactNode;
  children: ReactNode;
  alignRight?: boolean;
  title?: string;
  priority?: ButtonProps["priority"];
  modalPriority?: ButtonProps["priority"];
  modalControlClassName?: string;
  dropdownControlClassName?: string;
  size?: ButtonProps["size"];
  displayDropdownArrow?: boolean;
  "data-testid"?: string;
};

export function Dropdown({
  id,
  control,
  children,
  alignRight = false,
  title,
  priority,
  modalPriority,
  modalControlClassName,
  dropdownControlClassName,
  size,
  displayDropdownArrow = true,
  "data-testid": dataTestId,
}: DropdownProps) {
  const formattedId = id.replace("-", "_");
  const [isOpen, setIsOpen] = useState(false);

  const modal = createModal({
    id: formattedId,
    isOpenedByDefault: false,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLElement>(null);

  const handleButtonClick = () => setIsOpen((prev) => !prev);

  const onClickOrEnterInsideDropdown = (
    event: KeyboardEvent<HTMLElement> | ReactMouseEvent<HTMLElement>,
  ) => {
    if (hasKey(event) && (event.key === "Tab" || event.key === "Shift")) return;

    if (hasKey(event) && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();

      const target = event.target as HTMLElement;
      if (
        target instanceof HTMLAnchorElement ||
        target instanceof HTMLButtonElement ||
        target.getAttribute("role") === "button" ||
        target.closest('a, button, [role="button"]')
      ) {
        const clickableElement = target.closest('a, button, [role="button"]') || target;
        (clickableElement as HTMLElement).click();
        setIsOpen(false);
      }
    }

    if (!hasKey(event) && event.target instanceof HTMLAnchorElement) {
      setIsOpen(false);
    }
  };

  useOnClickOutside(collapseRef as RefObject<HTMLElement>, (event) => {
    if (event.target instanceof HTMLElement && buttonRef.current?.contains(event.target)) {
      return;
    }
    setIsOpen(false);
  });

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.setAttribute("aria-expanded", `${isOpen}`);
    }
  }, [isOpen]);

  return (
    <>
      <div className="fr-hidden-md">
        <Button
          className={clsx(displayDropdownArrow && "fr-dropdown__btn", modalControlClassName)}
          priority={modalPriority || priority}
          title={title}
          type="button"
          size={size}
          data-testid={dataTestId}
          {...modal.buttonProps}
        >
          {control}
        </Button>
        <modal.Component title={title}>
          <nav
            className="fr-dropdown__modal"
            style={{ [alignRight ? "right" : "left"]: 0 }}
            id={formattedId}
          >
            {children}
          </nav>
        </modal.Component>
      </div>
      <div className="fr-dropdown fr-hidden fr-unhidden-md">
        <Button
          className={clsx(displayDropdownArrow && "fr-dropdown__btn", dropdownControlClassName)}
          priority={priority}
          title={title}
          type="button"
          size={size}
          aria-expanded={isOpen}
          aria-controls={formattedId}
          ref={buttonRef}
          data-testid={dataTestId}
          onClick={handleButtonClick}
        >
          {control}
        </Button>
        {isOpen && (
          <nav
            className="fr-collapse fr-dropdown__pane fr-mr-1v"
            style={{ [alignRight ? "right" : "left"]: 0 }}
            id={formattedId}
            ref={collapseRef}
            onClick={onClickOrEnterInsideDropdown}
            onKeyDown={onClickOrEnterInsideDropdown}
          >
            {children}
          </nav>
        )}
      </div>
    </>
  );
}
