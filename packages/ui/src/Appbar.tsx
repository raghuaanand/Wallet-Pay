import { Button } from "./button";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            WalletPay
                        </h1>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {user && (
                        <span className="text-sm text-gray-700 hidden sm:block">
                            Welcome, {user.name || 'User'}
                        </span>
                    )}
                    <Button 
                        onClick={user ? onSignout : onSignin}
                        variant={user ? "secondary" : "primary"}
                        size="sm"
                    >
                        {user ? "Logout" : "Login"}
                    </Button>
                </div>
            </div>
        </div>
    </div>
}