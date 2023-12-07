import { useState, HTMLAttributes } from "react";

import { css } from "emotion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TItem, useCtaListStore } from "./sortableCtaListStore";

import {
	Box,
	Card,
	DragHandle,
	Flex,
	IconButton,
	Text,
	TextInput,
} from "@contentful/f36-components";
import { DeleteIcon, EditIcon, DoneIcon } from "@contentful/f36-icons";

type TSortableCardsProps = {
	item: TItem;
} & HTMLAttributes<HTMLDivElement>;

export const CtaListItem = ({ item }: TSortableCardsProps) => {
	const { updateItem, deleteItem, editId, editItem } = useCtaListStore(
		(state) => state
	);
	// init state for input
	const [inputState, setInputState] = useState({
		label: item.label,
		url: item.url,
	});

	//destructure props
	const { id } = item;

	const styles = {
		card: css({
			// This lets us change z-index when dragging
			position: "relative",
		}),
		dragHandle: css({
			alignSelf: "stretch",
		}),
	};

	const { attributes, listeners, setNodeRef, transform, transition, active } =
		useSortable({
			id,
		});
	const zIndex = active && active.id === id ? 1 : 0;
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex,
	};

	const disabled = !editId ? true : editId === item.id;

	return (
		<Card
			className={styles.card}
			dragHandleRender={() => (
				<DragHandle
					as="button"
					className={styles.dragHandle}
					label="Move card"
					{...attributes}
					{...listeners}
				/>
			)}
			padding="none"
			withDragHandle
			ref={setNodeRef}
			style={style}
		>
			<Box padding="spacingS">
				<Flex
					flexDirection="row"
					justifyContent="between"
					alignItems="end"
					gap="spacingS"
				>
					<Flex flexDirection="column" flexGrow={1}>
						<Text
							fontColor="blue800"
							fontWeight="fontWeightMedium"
							marginBottom="spacingXs"
						>
							Label
						</Text>
						{editId === item.id ? (
							<TextInput
								name="label"
								onKeyDown={function noRefCheck() {}}
								placeholder="Enter Label"
								size="medium"
								onChange={(e) => {
									setInputState({ ...inputState, label: e.target.value });
								}}
								value={inputState.label}
							/>
						) : (
							<Text>{item.label}</Text>
						)}
					</Flex>
					<Flex flexDirection="column" flexGrow={1}>
						<Text
							fontColor="blue800"
							fontWeight="fontWeightMedium"
							marginBottom="spacingXs"
						>
							Url
						</Text>
						{editId === item.id ? (
							<TextInput
								name="url"
								onKeyDown={function noRefCheck() {}}
								placeholder="Enter Url"
								size="medium"
								onChange={(e) => {
									setInputState({ ...inputState, url: e.target.value });
								}}
								value={inputState.url}
							/>
						) : (
							<Text>{item.url}</Text>
						)}
					</Flex>
					<Flex flexDirection="column" flexGrow={0} alignSelf="center">
						{editId === item.id ? (
							<>
								<IconButton
									variant="transparent"
									aria-label="Update"
									icon={<DoneIcon />}
									onClick={() => {
										updateItem(item.id, inputState.label, inputState.url);
									}}
									isDisabled={!disabled}
								/>
							</>
						) : (
							<>
								<IconButton
									variant="transparent"
									aria-label="edit"
									icon={<EditIcon />}
									onClick={() => editItem(item.id)}
									isDisabled={!disabled}
								/>
							</>
						)}
						<IconButton
							variant="transparent"
							aria-label="Select the date"
							icon={<DeleteIcon />}
							onClick={() => deleteItem(item.id)}
							isDisabled={!disabled}
						/>
					</Flex>
				</Flex>
			</Box>
		</Card>
	);
};
