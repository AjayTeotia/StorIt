import Image from "next/image";
import { Button } from "./ui/button";
import { Search } from "./Search";
import { signOutUser } from "@/lib/actions/user.action";

export const Header = ({
    userId,
    accountId
}: {
    userId: string;
    accountId: string;
}) => {
    console.log('Header');
    return (
        <header className="header">
            <Search />

            <div className="header-wrapper">
                FileUploader

                <form
                    action={async () => {
                        "use server";

                        await signOutUser();
                    }}
                >
                    <Button
                        type="submit"
                        className="sign-out-button"
                    >
                        <Image
                            src="/assets/icons/logout.svg"
                            alt="Logout"
                            width={24}
                            height={24}
                            className="size-6"
                        />
                    </Button>
                </form>
            </div>
        </header>
    )
}