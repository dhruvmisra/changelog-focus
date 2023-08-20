import { FLOATING_FOCUS_BUTTON_HIDE_TIMEOUT } from "@/constants";
import { useEffect, useState } from "react";
import { useTimeoutFn } from "react-use";

type FocusButtonProps = {
    isFocused: boolean;
    handleFocusClick: () => void;
};

type FloatingFocusButtonProps = FocusButtonProps & {
    focusAvailable: boolean;
};

export const FocusButton = ({ isFocused, handleFocusClick }: FocusButtonProps) => {
    return (
        <button
            type="button"
            className={`block w-auto rounded-md px-2 py-1 text-center text-xs font-bold text-white shadow-md focus:outline-none ${
                isFocused
                    ? "bg-red-700 shadow-red-700/50 hover:bg-red-800 focus:ring-red-300"
                    : "bg-green-600 shadow-green-600/50 hover:bg-green-500 focus:ring-green-400"
            }`}
            onClick={handleFocusClick}
        >
            {isFocused ? "UNFOCUS" : "FOCUS"}
        </button>
    );
};

export const FloatingFocusButton = ({
    isFocused,
    focusAvailable,
    handleFocusClick,
}: FloatingFocusButtonProps) => {
    const [hasFocusBeenAvailable, setHasFocusBeenAvailable] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);
    const collapse = () => {
        if (hasFocusBeenAvailable) {
            setExpanded(false);
        }
    };
    const [, , reset] = useTimeoutFn(collapse, FLOATING_FOCUS_BUTTON_HIDE_TIMEOUT);

    useEffect(() => {
        if (focusAvailable && !hasFocusBeenAvailable) {
            setHasFocusBeenAvailable(true);
            setExpanded(true);
        }
    }, [focusAvailable, hasFocusBeenAvailable]);

    useEffect(() => {
        reset();
    }, [expanded, reset]);

    const handleFloatingFocusClick = () => {
        if (expanded) {
            handleFocusClick();
            reset();
        }
    };

    return (
        <div
            className={`focus-btn-bg block sm:hidden ${expanded ? "expanded" : ""}`}
            onClick={() => setExpanded(true)}
        >
            <FocusButton isFocused={isFocused} handleFocusClick={handleFloatingFocusClick} />
        </div>
    );
};
