
import { ConversationListPane } from "./ConversationListPane";
import { ConversationMainPane } from "./ConversationMainPane";
import { ConversationSummaryPane } from "./ConversationSummaryPane";

import "./AppContents.css";

export const AppContents = () => {
    return (
        <>
            <div
                className="appContents"
            >
                <ConversationListPane />
                <ConversationMainPane />
                <ConversationSummaryPane />
            </div>
        </>
    );
}
