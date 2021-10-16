import React, { useState } from "react";
import styles from "./EditNote.module.css";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../../config/redux/store";
import { INote, INoteWithoutIds } from "../../../interfaces/note";
import TextareaAutosize from "react-textarea-autosize";
import { Segment, Form, Icon } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { Tag, Pin, Reminder, Event } from "../icons";
import { createNoteAPI } from "../../../helpers/api/notes";
const DATE_FORMAT = "HH:mm MM-DD-YYYY";

const EditNote = ({
    note,
    doneEditing,
}: {
    note: INote;
    doneEditing: () => void;
}): JSX.Element => {
    const user = useSelector((state: RootState) => state.user.account);
    const { tags } = note;

    const [title, setTitle] = useState(note.title ? note.title : "");
    const [text, setText] = useState(note.text ? note.text : "");
    const [pinned, togglePinned] = useState(note.pinned);
    const [tag, setTag] = useState(note.tags[0] ? note.tags[0] : "");
    const [showEventTimePicker, toggleShowEventTimePicker] = useState(false);
    const [eventTime, setEventTime] = useState(
        note.eventTime ? note.eventTime : ""
    );

    const [showReminderTimePicker, toggleShowReminderTimePicker] =
        useState(false);
    const [reminderTime, setReminderTime] = useState(
        note.reminderTime ? note.reminderTime : ""
    );

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };
    const handleTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value);
    };
    const pinOnClick = () => {
        togglePinned(!pinned);
    };
    const handleEventTime = (
        event: React.SyntheticEvent | undefined,
        data: { value: string }
    ) => {
        setEventTime(data.value);
        toggleShowEventTimePicker(false);
    };
    const handleReminderTime = (
        event: React.SyntheticEvent | undefined,
        data: { value: string }
    ) => {
        setReminderTime(data.value);
        toggleShowReminderTimePicker(false);
    };

    const fieldsNotChanged = () => {
        if (
            title === "" &&
            text === "" &&
            pinned === false &&
            tag === "" &&
            eventTime === "" &&
            reminderTime === ""
        )
            return true;
        else return false;
    };

    const handleSubmit = async () => {
        if (fieldsNotChanged()) return;

        const newNote: INoteWithoutIds = {
            title: title,
            user: user._id,
            text: text,
            image: null,
            reminderTime: reminderTime !== "" ? reminderTime : null,
            eventTime: eventTime !== "" ? eventTime : null,
            pinned: pinned,
            tags: [capitalize(tag)],
            relatedNotes: [],
        };
        createNoteAPI(newNote);
        doneEditing();
    };

    return (
        <div className={styles.Segment}>
            <Segment.Group raised>
                <Segment>
                    <Form onSubmit={handleSubmit}>
                        <div className={styles.wholeContainer}>
                            <div className={styles.scroll}>
                                <div className={styles.body}>
                                    <div className={styles.title}>
                                        <Form.Input
                                            transparent
                                            placeholder="Add title"
                                            value={title}
                                            onChange={handleTitle}
                                        />
                                    </div>
                                    <div className={styles.content}>
                                        <Form.TextArea
                                            control={TextareaAutosize}
                                            style={{
                                                padding: "0px",
                                                border: "none",
                                                overflow: "hidden",
                                            }}
                                            placeholder="Add text"
                                            value={text}
                                            onChange={handleText}
                                        />
                                        <div className={styles.tag}>
                                            {tags[0] ? (
                                                <Tag tag={tags[0]} />
                                            ) : (
                                                <div className={styles.addTag}>
                                                    <Tag tag=" " />
                                                    <Form.Input
                                                        transparent
                                                        placeholder="Add tag"
                                                        value={tag}
                                                        onChange={handleTag}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rightContainer}>
                                <div className={styles.doneRow}>
                                    {fieldsNotChanged() ? (
                                        <Form.Button
                                            disabled
                                            icon="check"
                                            size="tiny"
                                            color="orange"
                                        />
                                    ) : (
                                        <Form.Button
                                            icon="check"
                                            size="tiny"
                                            color="orange"
                                        />
                                    )}
                                </div>
                                <div className={styles.buttonRows}>
                                    <div
                                        className={styles.button}
                                        onClick={pinOnClick}
                                    >
                                        {pinned ? "Pinned" : "Pin"}
                                        <Pin pinned={pinned} />
                                    </div>

                                    {showReminderTimePicker ? (
                                        <div className={styles.timePicker}>
                                            <Icon
                                                name="times"
                                                color="grey"
                                                onClick={() =>
                                                    toggleShowReminderTimePicker(
                                                        false
                                                    )
                                                }
                                            />
                                            <DateTimeInput
                                                name="reminderTime"
                                                placeholder="Reminder Time"
                                                value={reminderTime}
                                                iconPosition="left"
                                                popupPosition="right center"
                                                dateTimeFormat={DATE_FORMAT}
                                                onChange={handleReminderTime}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={styles.button}
                                            onClick={() =>
                                                toggleShowReminderTimePicker(
                                                    true
                                                )
                                            }
                                        >
                                            {!reminderTime && "Add reminder"}
                                            <Reminder time={reminderTime} />
                                        </div>
                                    )}
                                    {showEventTimePicker ? (
                                        <div className={styles.timePicker}>
                                            <Icon
                                                name="times"
                                                color="grey"
                                                onClick={() =>
                                                    toggleShowEventTimePicker(
                                                        false
                                                    )
                                                }
                                            />
                                            <DateTimeInput
                                                name="eventTime"
                                                placeholder="Event Time"
                                                value={eventTime}
                                                iconPosition="left"
                                                popupPosition="right center"
                                                dateTimeFormat={DATE_FORMAT}
                                                onChange={handleEventTime}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={styles.button}
                                            onClick={() =>
                                                toggleShowEventTimePicker(true)
                                            }
                                        >
                                            {!eventTime && "Add event"}
                                            <Event time={eventTime} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Form>
                </Segment>
            </Segment.Group>
        </div>
    );
};

export default EditNote;
