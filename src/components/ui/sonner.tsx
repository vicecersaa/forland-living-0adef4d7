import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-background/60 !backdrop-blur-md !border !border-foreground/10 !text-foreground !shadow-none rounded-none",
          description: "!text-foreground/60 text-xs",
          actionButton: "!bg-foreground !text-background text-xs tracking-widest uppercase",
          cancelButton: "!bg-transparent !text-foreground/50 text-xs tracking-widest uppercase",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };