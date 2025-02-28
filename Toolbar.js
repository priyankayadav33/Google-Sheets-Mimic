import React from "react";
import { Button, Group, Tooltip } from "@mantine/core";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, X } from "lucide-react";

const Toolbar = ({ onFormatChange, onClearCell }) => {
  return (
    <div className="toolbar">
      <Group spacing="xs">
        <Tooltip label="Bold">
          <Button variant="light" onClick={() => onFormatChange("bold")}>
            <Bold size={18} />
          </Button>
        </Tooltip>

        <Tooltip label="Italic">
          <Button variant="light" onClick={() => onFormatChange("italic")}>
            <Italic size={18} />
          </Button>
        </Tooltip>

        <Tooltip label="Underline">
          <Button variant="light" onClick={() => onFormatChange("underline")}>
            <Underline size={18} />
          </Button>
        </Tooltip>

        <Tooltip label="Align Left">
          <Button variant="light" onClick={() => onFormatChange("left")}>
            <AlignLeft size={18} />
          </Button>
        </Tooltip>

        <Tooltip label="Align Center">
          <Button variant="light" onClick={() => onFormatChange("center")}>
            <AlignCenter size={18} />
          </Button>
        </Tooltip>

        <Tooltip label="Align Right">
          <Button variant="light" onClick={() => onFormatChange("right")}>
            <AlignRight size={18} />
          </Button>
        </Tooltip>

        <Tooltip label="Clear Cell">
          <Button variant="light" color="red" onClick={onClearCell}>
            <X size={18} />
          </Button>
        </Tooltip>
      </Group>
    </div>
  );
};

export default Toolbar;
