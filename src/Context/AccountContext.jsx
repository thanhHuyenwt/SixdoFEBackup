import React,{createContext,useState} from 'react';

const AccountContext = createContext();

function AccountInforProvider({children}) {
    const [currentAccount,setCurrentAccount] = useState(
        {
            accountId:null,
            accountUserName:"",
            accountRoleId:null
        })
    const defaultAccount = {
        accountId:null,
        accountUserName:"",
        accountRoleId:null
    }
    const hasLogined = currentAccount.accountId !== null;
    const isAdmin =hasLogined && ( currentAccount.accountRoleId === 1 ||  currentAccount.accountRoleId === 2);
    const AccountSetting = {
        isAdmin,
        hasLogined,
        currentAccount,
        setCurrentAccount,
        defaultAccount
    }
    return (
        <AccountContext.Provider value={AccountSetting}>
            {children}
        </AccountContext.Provider>
    )
}

export {AccountContext,AccountInforProvider};