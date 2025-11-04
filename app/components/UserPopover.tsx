
import styles from "~/css/UserPopover.module.css";
import { Popover } from '@base-ui-components/react/popover';
import { Avatar } from '@base-ui-components/react/avatar';
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { userService } from "~/services/userService";
import { useNavigate } from "react-router";
export default function UserPopover({ currentUser, apiUsage }: {
    currentUser: User;
    apiUsage?: { used: number; limit: number }
}) {

    const [usageAPI, setUsageAPI] = useState({ used: 0, limit: 500 });

    const navigator = useNavigate();

    useEffect(() => {
        if (currentUser == null) return;
        const unsubscribe = userService.listenToUserUsageApi(currentUser.uid, (data) => {
            if (!data) {
                console.log("User not found or deleted",);
                return;
            }

            console.log("Realtime usage:", data.usageApi);
            setUsageAPI(prev => ({...prev,used : data.usageApi || 0}));
        });

        
        // return () => unsubscribe();
    }, [currentUser]);

    return (
        <Popover.Root>
            <Popover.Trigger className={styles.AvatarButton}>
                <Avatar.Root className={styles.AvatarRoot}>
                    <Avatar.Image
                        src={currentUser?.photoURL!}
                        width="48"
                        height="48"
                        className={styles.AvatarImage}
                    />


                    <Avatar.Fallback className={styles.AvatarFallback}>
                        {currentUser?.displayName?.slice(0, 2) ?? "UR"}
                    </Avatar.Fallback>


                </Avatar.Root>

                <span className="text-gray-700 ml-2 dark:text-gray-200 text-sm font-medium">
                    {currentUser.displayName}
                </span>
            </Popover.Trigger>


            <Popover.Portal>
                <Popover.Positioner className={"z-10"} sideOffset={8}>
                    <Popover.Popup className={styles.Popup}>
                        <Popover.Arrow className={styles.Arrow}>
                            <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                                <path d="M8 0L16 8H0L8 0Z" fill="currentColor" />
                            </svg>
                        </Popover.Arrow>

                        <Popover.Title className={styles.Title}>
                            {currentUser?.displayName ?? "User"}
                        </Popover.Title>

                        <Popover.Description className={styles.Description}>
                            <div className={styles.InfoRow}>
                                <span>API Usage</span>
                                <span>
                                    <span className={usageAPI.used > usageAPI.limit ? "text-red-500" : ""}>{usageAPI.used}</span>/{usageAPI.limit}
                                </span>
                            </div>

                            <div className={styles.ProgressBar}>
                                <div
                                    className={styles.ProgressFill}
                                    style={{ width: `${Math.min((usageAPI.used / usageAPI.limit) * 100, 100)}%` }}
                                />
                            </div>

                            <button
                                className={styles.UpgradeButton}
                                onClick={() => navigator("/upgrade")}
                            >
                                Upgrade Plan →
                            </button>
                        </Popover.Description>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}

