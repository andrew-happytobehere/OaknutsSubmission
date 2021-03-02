import * as React from "react";
import logo from "../../../logo.svg";
import { ConnectButonUI } from "../../managed/ConnectButtonView";
import { PersonTileComponent } from "./PersonTileComponent";
import styles from "../../css/SignInPage.module.css";
import Observer from "@researchgate/react-intersection-observer";
import { Cluster } from "@solana/web3.js";
import andrew from "../../../team/andrew.png";
import ben from "../../../team/ben.png";
import cameraphobic from "../../../team/cameraphobic.jpg";
import mrinal from "../../../team/mrinal.png";
import n8 from "../../../team/n8.gif";
import justin from "../../../team/tyro.png";

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
                    <div className={styles.aboutTitleArea}></div>
                    <div className={styles.aboutTextArea}>
                        <p>
                            We all know that Ethereum gas fees have reached
                            extreme levels, recently. We check our fees.wtf page
                            and feel pain, or even avoid the page at all costs.
                        </p>
                        <br />
                        <p>
                            But when we look at how much we've spent, do we
                            really consider what else that money could have
                            gone? Do we really consider that we never had to
                            lose that money in the first place?
                        </p>
                        <br />
                        <p>
                            Oaknuts is here to show the community what your fees
                            could do for you in a world where you don't have to
                            give them up. Come get your SOL, and take back your
                            soul.
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
                            picture={n8}
                            name="n8"
                            description="n8 is sad that gas fees are inhibiting him from trying every single new crypto product. He also tweets SBF when he misses what it feels like to have someone read and like your tweet."
                        />
                        <PersonTileComponent
                            picture={cameraphobic}
                            name="cameraphobic"
                            description="cameraphobic is a UX designer and Fine Arts defector. She has been known to wax misty-eyed on the finer points of non-destructive editing and version control."
                        />
                        <PersonTileComponent
                            picture={ben}
                            name="Ben is a hen"
                            description="Hens are omnivores. Don't smack them when you're breaking pots."
                        />
                        <PersonTileComponent
                            picture={mrinal}
                            name="Mrinal"
                            description="Hi I'm Mrinal, I met Nate through work, and I've maybe known him for a few hours."
                        />
                        <PersonTileComponent
                            picture={justin}
                            name="PM Justin"
                            description="Justin Pierre James Trudeau PC MP is a Canadian politician who has served as the 23rd prime minister of Canada since 2015 and has been the leader of the Liberal Party since 2013. "
                        />
                        <PersonTileComponent
                            picture={andrew}
                            name="Andrew"
                            description="I'm just happy to be here"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default SignInPage;
