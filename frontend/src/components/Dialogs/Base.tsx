import { DialogTitle, IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, background:"#36393f", color:"white", borderRadius:"20px 20px 0 0" }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={()=>{
            onClose()
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "gray",
          }}
        >
          <MdClose/>
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
