import * as React from "react";
import logo from "../../../logo.svg";
import { ConnectButonUI } from "../../managed/ConnectButtonView";
import { PersonTileComponent } from "./PersonTileComponent";
import styles from "../../css/SignInPage.module.css";
import Observer from "@researchgate/react-intersection-observer";
import { Cluster } from "@solana/web3.js";

export interface SignInPageProps {
    cluster: Cluster;
    onWalletConnected: (wallet: any) => void;
}

export class SignInPage extends React.Component<SignInPageProps> {
    constructor(props: SignInPageProps) {
        super(props);
    }

    render() {
        return (
            <div className={styles.SignInPage}>
                <div className={styles.logoTileContainer}>
                    <header className={styles.logoHeaderArea}>
                        <img src={logo} className={styles.signInPageLogo} />
                        <h1>OakNuts</h1>
                        <h2>
                            Gas is taking your soul, we're here to take it back
                        </h2>
                    </header>
                    <ConnectButonUI
                        buttonIdentifier="LargeSignInPageConnectButton"
                        buttonType="main"
                        cluster={this.props.cluster}
                        handleConnectWallet={this.props.onWalletConnected}
                    />
                    {/* Don't need drop down for choose Main/Dev/Testnet <div className={styles.dropDownContainer}>
                        <div className={styles.dropDown}>
                            <button className={styles.dropDownButton}>
                                Mainnet Beta
                            </button>
                            <div className={styles.dropDownContent}>
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                        </div>
                    </div> */}
                    <p className={styles.signInPageScroll}>
                        Read more
                        <span className={styles.signInPageScrollArrow}>
                            &#9759;
                        </span>
                    </p>
                </div>

                <div className={styles.aboutTileContainer}>
                    <div className={styles.aboutTileHeaderArea}>
                        <h2>About Oaknuts</h2>
                        <div className={styles.line} />
                    </div>
                    <div className={styles.aboutTitleArea}>
                        <h3>Morbi leo risus, porta ac consectetur</h3>
                    </div>
                    <div className={styles.aboutTextArea}>
                        <p>
                            Donec ullamcorper nulla non metus auctor fringilla.
                            Maecenas faucibus mollis interdum. Nullam quis risus
                            eget urna mollis ornare vel eu leo. Fusce dapibus,
                            tellus ac cursus commodo, tortor mauris condimentum
                            nibh, ut fermentum massa justo sit amet risus.
                        </p>
                        <br />
                        <p>
                            Donec id elit non mi porta gravida at eget metus.
                            Cum sociis natoque penatibus et magnis dis
                            parturient montes, nascetur ridiculus mus. Donec
                            ullamcorper nulla non metus auctor fringilla. Lorem
                            ipsum dolor sit amet, consectetur adipiscing elit.
                            Integer posuere erat a ante venenatis dapibus
                            posuere velit aliquet. Donec sed odio dui.
                        </p>
                    </div>
                </div>

                <div className={styles.foundersTileContainer}>
                    <div className={styles.foundersTileHeaderArea}>
                        <h2>About Us</h2>
                        <div className={styles.line} />
                    </div>
                    <div className={styles.foundersTitleArea}>
                        <h3>Meet the Founders</h3>
                    </div>
                    <div className={styles.foundersPersonContainerArea}>
                        <PersonTileComponent
                            picture={logo}
                            name="Nate the Cake"
                            description="Always found at parties and full of carbs. His least favorite cake is urinal"
                        />
                        <PersonTileComponent
                            picture={logo}
                            name="Brittany not Spears"
                            description="Britney Jean Spears (born December 2, 1981) is an American singer, songwriter, dancer, and actress."
                        />
                        <PersonTileComponent
                            picture={logo}
                            name="Ben is a hen"
                            description="Hens are omnivores. Don't smack them when you're breaking pots."
                        />
                        <PersonTileComponent
                            picture={logo}
                            name="Mrinal"
                            description="Hi I'm Mrinal, I met Nate through work, and I've maybe known him for a few hours."
                        />
                        <PersonTileComponent
                            picture={logo}
                            name="PM Justin"
                            description="Justin Pierre James Trudeau PC MP is a Canadian politician who has served as the 23rd prime minister of Canada since 2015 and has been the leader of the Liberal Party since 2013. "
                        />
                        <PersonTileComponent
                            picture={logo}
                            name="Andrew"
                            description="hello, I feel weird."
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default SignInPage;
