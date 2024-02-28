import type { MapPoint } from "~/types/MapPoint";

const getUrl = "/api/points/get";
const postUrl = "/api/points/post";
const deleteUrl = "/api/points/delete";
// const deleteEndpoint = `/api/points/${pointId}`;

export const useMapPointsStore = defineStore("mapPoints", () => {
	const pointsRef = ref(<MapPoint[]>[]);
	const count = computed(() => pointsRef.value.length);
	const mapPoints = computed(() => pointsRef.value);
	let isLoading = ref(true);

	const fetchPoints = async () => {

		const { data, pending, error, refresh } = await useAsyncData(
			'points',
			() => $fetch(getUrl)
		  )
		//   console.log(data.value);
		  
		try {
			const response = await $fetch(getUrl);
			// console.log(response.body, 'my store');
			pointsRef.value = response.body as MapPoint[];
		} catch (error) {
			throw new Error("Something went wrong");
		} finally {
			isLoading.value = false;
			// console.log('finally fetched');
		}
	};

	const addPoint = async (newPoint: MapPoint) => {
		try {
			console.log("Request Payload:", JSON.stringify(newPoint));
			const response = await $fetch(postUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newPoint),
			});

			if (response.statusCode === 201) {
				ElNotification.success({
					title: "Info",
					message: "Point added successfully",
					showClose: false,
					type: "success",
				});
				// You might want to fetch the updated points after adding a new one
				await fetchPoints();
			} else {
				console.error("Failed to add point:", response.body);
			}
		} catch (error) {
			console.error("Error adding point:", error);
			throw new Error("Something went wrong");
		}
	};

	const removePoint = async (pointId: string) => {
		try {
			console.log("Deleting point with ID:", pointId);

			const deleteEndpoint = `${deleteUrl}/${pointId}`;
			console.log("Deleting point with URL:", deleteEndpoint);
			//

			const deleteResponse = await $fetch(`${deleteUrl}/${pointId}`, {
				method: "DELETE",
			});

			if (deleteResponse.statusCode === 200) {
				ElNotification.success({
					title: "Info",
					message: "Point removed successfully",
					showClose: false,
					type: "success",
				});
				const indexToRemove = pointsRef.value.findIndex(
					(point) => point._id?.toString() === pointId
				);
				if (indexToRemove !== -1) {
					pointsRef.value.splice(indexToRemove, 1);
				} else {
					console.error("Point not found in local store");
				}
			} else if (deleteResponse.statusCode === 403) {
				ElNotification({
					title: "Warning",
					message: "Minimum quantity of points is 1",
					type: "warning",
				});
			} else {
				console.error("Failed to delete point:", deleteResponse.body);
			}
		} catch (error) {
			console.error("Error deleting point:", error);
			throw new Error("Something went wrong");
		}
	};

	return { mapPoints, count, isLoading, fetchPoints, addPoint, removePoint };
});
