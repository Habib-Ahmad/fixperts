import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui';

interface Props {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Modal = ({ children, open, onClose, title }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
