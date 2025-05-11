import { View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const StarRating = ({ star }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <FontAwesome
                key={i}
                name={i <= star ? "star" : "star-o"}
                size={16}
                color="#FFD700"
                style={{ marginHorizontal: 1 }}
            />
        );
    }

    return <View style={{ flexDirection: "row", marginTop: 4 }}>{stars}</View>;
};

export default StarRating;