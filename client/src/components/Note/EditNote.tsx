import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";
import styles from "./editNote.module.css";
import { INote, NoteModes } from "../../interfaces/note";

/* Need AnimatePresence because we still need the dom nodes after we close the animated note */
import { motion, AnimatePresence } from "framer-motion";
import { JSX_TYPES } from "@babel/types";

const EditNote = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            open: () => setOpen(true),
            close: () => setOpen(false),
        };
    });

    // api call
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={styles.backdrop}
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            duration: 0.25,
                        },
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            delay: 0.2,
                        },
                    }}
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        className={styles.editNoteWrapper}
                        initial={{
                            scale: 0,
                        }}
                        animate={{
                            scale: 1,
                            transition: {
                                duration: 0.25,
                            },
                        }}
                        exit={{
                            scale: 0,
                            transition: {
                                delay: 0.2,
                            },
                        }}
                    >
                        <motion.div
                            className={styles.editNoteContent}
                            initial={{
                                x: 150,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                transition: {
                                    delay: 0.25,
                                },
                            }}
                            exit={{
                                opacity: 0,
                                x: 150,
                                transition: {
                                    duration: 0.25,
                                },
                            }}
                        >
                            helloworld
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
/* I have no idea why we need this */
EditNote.displayName = "EditNote";
export default EditNote;