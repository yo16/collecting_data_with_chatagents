import { AppHeader } from "./AppHeader";
import { AppContents } from "./AppContents";
import { AppFooter } from "./AppFooter";

import "./App.css";

export default function App() {
    return (
        <>
            <div
                className="appBody"
            >
                <AppHeader />
                <AppContents />
                <AppFooter />
            </div>
        </>
    )
}
