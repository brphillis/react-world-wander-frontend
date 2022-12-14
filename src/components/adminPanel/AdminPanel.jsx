import "./adminPanel.css";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";

export default function AdminPanel({ profileEditor, setAdminPanel, width }) {
  const dragControls = useDragControls();
  const motionValues = {
    desktop: {
      position: "absolute",
      left: "35%",
      top: "1%",
      margin: "0",
    },
    mobile: {
      position: "absolute",
      left: "0",
      right: "0",
      marginLeft: "auto",
      marginRight: "auto",
      width: width,
    },
  };
  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={width > 600 ? motionValues.desktop : motionValues.mobile}
    >
      <div id="profileEditor">
        <div
          className="menuTopBar"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setAdminPanel(false)}
          />
          <p>Admin Panel</p>
        </div>

        <div className="profileEditorContent"></div>
      </div>
    </motion.div>
  );
}
