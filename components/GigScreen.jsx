import React, { useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	LayoutAnimation,
	Platform,
	Button,
	Linking
} from "react-native";
import { useState } from "react";
import { getGigsForHomePage } from "../utils/api";

import { addUserToChatGroup, createChatGroup } from "../firebase-sw-messaging";

const CONTENT = [
	{
		isExpanded: false,
		category_name: "item 1",
		subcategory: [
			{ id: 1, val: "Sub 1" },
			{ id: 2, val: "Sub 2" },
		],
	},
	{
		isExpanded: false,
		category_name: "item 2",
		subcategory: [
			{ id: 3, val: "Sub 3" },
			{ id: 4, val: "Sub 4" },
		],
	},
	{
		isExpanded: false,
		category_name: "item 3",
		subcategory: [
			{ id: 5, val: "Sub 5" },
			{ id: 6, val: "Sub 6" },
		],
	},
];

const ExpandableComponent = ({ item, onClickFunction }) => {
	const [layoutHeight, setLayOutHeight] = useState(0);

	useEffect(() => {
		if (item.isExpanded) {
			setLayOutHeight(null);
		} else {
			setLayOutHeight(0);
		}
	}, [item.isExpanded]);

	return (
		<View key={item.id}>
			<TouchableOpacity style={styles.item} onPress={onClickFunction}>
				<Text style={styles.itemText}>{item.category_name}</Text>
				<Text style={{color: 'blue'}}
      				onPress={() => Linking.openURL(item.image)}>
					<Image source={{ uri: item.image }} style={{ width: 375, height: 200 }} />
				</Text>					
			</TouchableOpacity>
			<View
				style={{
					height: layoutHeight,
					overflow: "hidden",
				}}
			>
				{item.subcategory.map((value) => {
					return (
						<TouchableOpacity key={value.val} style={styles.content}>
							<Text style={styles.text}>{value.val}</Text>
							<View style={styles.seperator} />
						</TouchableOpacity>
					);
				})}
				<Button
					title="I'm interested"
					onPress={() => {
						console.log(item.image);
						createChatGroup(
							item.id,
							item.category_name,
							item.subcategory[0].val,
							item.subcategory[2].val,
							item.image,
							item
						).then(() => {
							addUserToChatGroup(item.id);
						});
					}}
				/>
			</View>
		</View>
	);
};

export default function GigScreen(props) {
	const [multiSelect, setMultiSelect] = useState(false);
	const [listDataSource, setListDataSource] = useState(CONTENT);

	const contentFormat = (results) => {
		return results.map((gig) => {
			return {
				isExpanded: false,
				category_name: gig.name,
				id: gig.id,
				image: gig.images[4].url,
				subcategory: [
					{ val: gig.dates.start.localDate },
					{ val: gig.dates.status.code },
					{ val: gig._embedded.venues[0].name },
				],
			};
		});
	};

	const updateLayout = (index) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		const array = [...listDataSource];
		if (multiSelect) {
			//If multiple select is enabled
			array[index]["isExpanded"] = !array[index]["isExpanded"];
		} else {
			//If single select is enabled
			array.map((value, placeindex) => {
				return placeindex === index
					? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
					: (array[placeindex]["isExpanded"] = false);
			});
		}
		setListDataSource(array);
	};

	useEffect(() => {
		getGigsForHomePage(props.genreId, props.sort, props.city)
			.then((results) => {
				let newContentFormat = contentFormat(results);

				setListDataSource(newContentFormat);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [props.genreId, props.sort, props.city]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.titleText}>Gig List</Text>
					<TouchableOpacity onPress={() => setMultiSelect(!multiSelect)}>
						<Text style={styles.headerBtn}>
							{multiSelect
								? "Multiple selector\n Enabled"
								: "Single selector\n Enabled"}
						</Text>
					</TouchableOpacity>
				</View>
				<ScrollView>
					{listDataSource.map((item, key) => {
						return (
							<ExpandableComponent
								key={item.category_name + key.toString()}
								item={item}
								onClickFunction={() => {
									updateLayout(key);
								}}
							/>
						);
					})}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		flexDirection: "row",
		padding: 10,
	},
	titleText: {
		flex: 1,
		fontWeight: "bold",
	},
	headerBtn: {
		textAlign: "center",
		justifyContent: "center",
	},
	item: {
		backgroundColor: "orange",
		padding: 20,
	},
	itemText: {
		fontWeight: "500",
	},
	content: {
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: "#fff",
	},
	text: {
		padding: 10,
	},
	seperator: {
		height: 0.5,
		backgroundColor: "#c8c8c8",
		width: "100%",
	},
	gigContainer: {
		flexGrow: 0,
	},
	gigCard: {
		flexGrow: 0,
		alignItems: "center",
		justifyContent: "center",
	},
	gigInfo: {
		fontWeight: "700",
	},
	gigInfoBody: {
		lineHeight: 15 * 1.5,
		textAlign: "center",
		marginTop: 20,
	},
});
