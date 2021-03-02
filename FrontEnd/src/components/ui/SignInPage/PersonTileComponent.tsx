import * as React from "react";
import styles from "../../css/SignInPage.module.css";
export interface PersonTileComponentProps {
    picture: string;
    name: string;
    description: string;
}

// Common component for each of the Persons on the sign in page.
// Includes: picture, name, and description
export function PersonTileComponent(props: PersonTileComponentProps) {
    return (
        <div className={styles.personTileComponentContainer}>
            <div className={styles.pictureArea}>
                <img src={props.picture} className={styles.personPicture} />
            </div>
            <div className={styles.nameArea}>
                <h2>{props.name}</h2>
            </div>
            <div className={styles.descriptionArea}>
                <p>{props.description}</p>
            </div>
        </div>
    );
}
