import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    FlatList,
    TouchableOpacity,
    ToastAndroid,
    Animated,
    ViewPagerAndroid,
    InteractionManager,
    VirtualizedList,
    TouchableHighlight,
    Modal
} from "react-native";

import Swiper from "react-native-swiper";
import Screen from "../common/screen";
import common from "../common/common";

import CustomScrollView from "react-native-cm-custom-scrollview";

let data = require("../resource/product.json");
let dataMatch = require("../resource/prodMatch.json");

import LinearGradient from "react-native-linear-gradient";

import CountTag from "../component/CountTag";

let bannerImgs = [];
let items = ["商品", "详情", "评论"];

class Tab extends Component {
    constructor(props) {
        super(props);
    }

    _renderContent = () => {
        let selectedIndex = this.props.selectedIndex;

        let select = this.props.select;

        let views = [];

        items.map(function(item, index) {
            let view = (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        console.log("onPress: " + index);
                        select(index);
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <Text
                            style={{
                                margin: 10,
                                fontSize: selectedIndex === index ? 18 : 15,
                                color: selectedIndex == index ? "red" : "black"
                            }}
                        >
                            {item}
                        </Text>

                        {selectedIndex === index ? (
                            <View
                                style={{
                                    width: 20,
                                    height: 2,
                                    backgroundColor: "black"
                                }}
                            />
                        ) : (
                            <View />
                        )}
                    </View>
                </TouchableOpacity>
            );

            views.push(view);
        });

        return views;
    };

    render() {
        return (
            <ScrollView
                horizontal={true}
                contentContainerStyle={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    width: Screen.width
                }}
            >
                {this._renderContent()}
            </ScrollView>
        );
    }
}

export default class ProductDetail extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.routeName,
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            data: data,
            bottomProps: false,
            dataMatch: dataMatch,
            properties: [],
            opacity: new Animated.Value(0),
            showSwiper: true,
            selectedIndex: 0,
            scrollY: 0,
            modalVisible: false
        };
    }

    componentDidMount() {
        let properties = [];
        for (var key in this.state.data.data.styles[0].properties) {
            let value = this.state.data.data.styles[0].properties[key];
            console.log("key=" + key + ", value=" + value);

            let obj = {};
            obj.key = key;
            obj.value = value;
            properties.push(obj);
        }

        this.setState({
            properties: properties
        });

        bannerImgs = [];
        data.data.pics.map(function(item, i) {
            let v = (
                <Image
                    style={{ width: Screen.width, height: Screen.height / 3 }}
                    key={i}
                    resizeMode={"cover"}
                    source={{ uri: item }}
                />
            );
            bannerImgs.push(v);
        });
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onPageChange = e => {
        this.setState({
            selectedIndex: e.nativeEvent.position
        });

        if (e.nativeEvent.position > 0) {
            this.setState({
                opacity: 1
            });
        } else {
            if (this.state.scrollY >= 1) {
                this.setState({
                    opacity: 1
                });
            } else {
                this.setState({
                    opacity: 0
                });
            }
        }
    };
    _onContentScroll = e => {
        let percent = Math.abs(e.y) / 200;

        console.log(percent);

        if (percent >= 1.0) {
            percent = 1.0;
        }

        if (percent < 0) {
            percent = 0;
        }

        this.setState({
            opacity: percent,
            scrollY: percent
        });
    };

    _onTabClicked = index => {
        this.refs.ViewPagerAndroid.setPageWithoutAnimation(index);
    };

    _buyNow = () => {
        ToastAndroid.show("buyNow", ToastAndroid.SHORT);
    };

    _addShopCar = () => {
        ToastAndroid.show("addShopCar", ToastAndroid.SHORT);
    };

    _goProduct = () => {
        ToastAndroid.show("goProduct", ToastAndroid.SHORT);
    };

    _keyExtractor = (item, index) => item.id;

    _renderMatchItem = ({ item }) => (
        <TouchableOpacity onPress={this._goProduct} activeOpacity={0.8}>
            <View style={{ marginLeft: 5, marginRight: 5 }}>
                <Image
                    style={{ width: 90, height: 90 }}
                    source={{ uri: item.thumbUrl }}
                />
                <Text numberOfLines={2} style={{ width: 90 }}>
                    {item.productName}
                </Text>
                <Text style={{ color: "red", fontSize: 12 }}>
                    ¥{item.matchPrice}
                </Text>
            </View>
        </TouchableOpacity>
    );

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        return (
            <View style={{ height: Screen.height, backgroundColor: "white" }}>
                <CustomScrollView
                    upOnScroll={this._onContentScroll}
                    upChildren={
                        <View style={{ width: Screen.width, flex: 1 }}>
                            {this.state.showSwiper ? (
                                <Swiper
                                    loop={false}
                                    index={0}
                                    autoplay={false}
                                    autoplayTimeout={2}
                                    horizontal={true}
                                    pagingEnabled
                                    showsPagination={true}
                                    height={Screen.height / 3}
                                    contentContainerStyle={[
                                        styles.contentContainer,
                                        { flexDirection: "row" }
                                    ]}
                                    dotColor="black"
                                    activeDotColor="blue"
                                    paginationStyle={{
                                        width: 50,
                                        height: 20,
                                        left: Screen.width / 2 - 50 / 2,
                                        bottom: -5
                                    }}
                                    dotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5
                                    }}
                                    activeDotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5
                                    }}
                                >
                                    {bannerImgs}
                                </Swiper>
                            ) : (
                                <View style={{ height: Screen.height / 3 }} />
                            )}

                            <Text style={styles.title}>
                                {this.state.data.data.name}
                            </Text>
                            <Text style={styles.title_1}>
                                {this.state.data.data.description}
                            </Text>
                            {/*价格*/}
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        margin: 10,
                                        alignItems: "flex-end"
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "red",
                                            fontSize: 19,
                                            fontWeight: "normal"
                                        }}
                                    >
                                        ¥4.00
                                    </Text>
                                    <Text>¥4.00</Text>
                                </View>
                                <Text style={{ margin: 10 }}>总销量 0</Text>
                            </View>

                            {/*商品属性*/}
                            {this.state.properties.map(function(item, i) {
                                return (
                                    <View
                                        key={i}
                                        style={{ flex: 1, width: Screen.width }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: "black",
                                                height: 0.21,
                                                marginLeft: 10
                                            }}
                                        />
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                margin: 10,
                                                alignItems: "center"
                                            }}
                                        >
                                            <Text style={{ fontSize: 18 }}>
                                                {item.key}
                                            </Text>
                                            <Text style={{ marginLeft: 10 }}>
                                                {item.value}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                            {/*商品加减*/}
                            <View
                                style={{
                                    backgroundColor: "black",
                                    height: 0.21,
                                    marginLeft: 10
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    margin: 10,
                                    alignItems: "center"
                                }}
                            >
                                <Text style={{ fontSize: 18, marginRight: 10 }}>
                                    数量
                                </Text>
                                <View
                                    style={{
                                        borderWidth: 0.2,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}
                                    >
                                        -
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderWidth: 0.2,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            marginLeft: 12,
                                            marginRight: 12
                                        }}
                                    >
                                        0
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderWidth: 0.2,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 19,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}
                                    >
                                        +
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{ backgroundColor: "snow", height: 10 }}
                            />
                            <Text style={{ fontSize: 18, margin: 10 }}>
                                商品推荐
                            </Text>

                            <View style={{ height: 140 }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    data={this.state.dataMatch.data}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderMatchItem}
                                />
                            </View>

                            <View
                                style={{
                                    marginTop: 20,
                                    marginBottom: 20,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Text>到底了</Text>
                            </View>
                        </View>
                    }
                    downChildren={
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                            <Text
                                style={{
                                    margin: 20,
                                    color: "black",
                                    fontSize: 22
                                }}
                            >
                                11111111111
                            </Text>
                        </View>
                    }
                />

                <Animated.View
                    style={{
                        backgroundColor: "white",
                        width: Screen.width,
                        height: 48,
                        position: "absolute",
                        top: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: this.state.opacity
                    }}
                >
                    <Tab
                        selectedIndex={this.state.selectedIndex}
                        select={index => this._onTabClicked(index)}
                    />
                </Animated.View>
                <View
                    style={{
                        backgroundColor: "transparent",
                        width: Screen.width,
                        height: 48,
                        position: "absolute",
                        top: 0
                    }}
                >
                    <TouchableOpacity>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: 10,
                                opacity: 1 - this.state.opacity
                            }}
                            source={require("../../res/images/icon-back.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setModalVisible(true)}
                        style={{ position: "absolute", right: 0 }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: 10,
                                opacity: this.state.selectedIndex > 0 ? 0 : 1
                            }}
                            source={require("../../res/images/icon-more.png")}
                        />
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        // alert("Modal has been closed.")
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            marginTop: 0,
                            backgroundColor: "transparent",
                            opacity: 1,
                            alignItems: "flex-end"
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                        >
                            <View
                                style={{
                                    marginTop: 50,
                                    backgroundColor: "transparent",
                                    flex: 1,
                                    width: Screen.width,
                                    alignItems: "flex-end"
                                }}
                            >
                                <View
                                    style={{
                                        width: Screen.width / 3,
                                        backgroundColor: "#ffffff",
                                        marginRight: 10,
                                        borderRadius: 5
                                    }}
                                >
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(
                                                !this.state.modalVisible
                                            );
                                            this.props.navigation.navigate(
                                                "Home"
                                            );
                                        }}
                                        style={{ margin: 8 }}
                                    >
                                        <Text>Home</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(
                                                !this.state.modalVisible
                                            );
                                        }}
                                        style={{ margin: 8 }}
                                    >
                                        <Text>Setting</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(
                                                !this.state.modalVisible
                                            );
                                        }}
                                        style={{ margin: 8 }}
                                    >
                                        <Text>Setting</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(
                                                !this.state.modalVisible
                                            );
                                        }}
                                        style={{ margin: 8 }}
                                    >
                                        <Text>Setting</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setModalVisible(
                                                !this.state.modalVisible
                                            );
                                        }}
                                        style={{ margin: 8 }}
                                    >
                                        <Text>Setting</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View
                    style={{
                        zIndex: 10000,
                        backgroundColor: "white",
                        height: 60,
                        flexDirection: "row"
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            flex: 3,
                            backgroundColor: "white",
                            alignItems: "center",
                            marginTop: 8,
                            justifyContent: "space-around"
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Image
                                style={{
                                    marginBottom: 5,
                                    width: 30,
                                    height: 30
                                }}
                                source={require("../../res/images/icon-service.png")}
                            />
                            <Text>客服</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Image
                                style={{
                                    marginBottom: 5,
                                    width: 30,
                                    height: 30
                                }}
                                source={require("../../res/images/icon-favorite.png")}
                            />
                            <Text>收藏</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Image
                                style={{
                                    marginBottom: 5,
                                    width: 30,
                                    height: 30
                                }}
                                source={require("../../res/images/icon-shop-cart.png")}
                            />

                            <Text>购物车</Text>
                            <CountTag
                                style={{
                                    position: "absolute",
                                    right: 1,
                                    top: 1
                                }}
                                text={35}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{ flex: 2 }}
                        onPress={this._addShopCar}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#FFD801", "#FF8040"]}
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Text
                                style={{
                                    color: common.textColor,
                                    fontSize: 16
                                }}
                            >
                                加入购物车
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flex: 2 }}
                        onPress={this._buyNow}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#FF8040", "#F75D59"]}
                            style={{
                                flex: 1,
                                backgroundColor: "green",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Text
                                style={{
                                    color: common.textColor,
                                    fontSize: 16
                                }}
                            >
                                立即购买
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    title: {
        margin: 10,
        color: "black",
        fontSize: 16,
        fontWeight: "normal"
    },
    title_1: {
        marginLeft: 10,
        color: "red"
    },
    contentContainer: {
        width: 2 * Screen.width,
        height: Screen.height / 3
    }
});
