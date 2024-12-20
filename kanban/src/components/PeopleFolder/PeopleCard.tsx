import React, { useContext } from 'react'
import { useState } from 'react'
import { MemberRoleContext } from '../../context/MemberRoleContext';
type PeopleCardProps = {
    displayName: string;
    memberId: string;
    memberRole: string;
    handleUpdateMemberRole: (memberId: string, role: string) => void
}


enum RoleEnum {
    MEMBER = "member",
    LEADER = "leader",
    ADMIN = "admin"
}

const roleColor = {
    member: "yellow-500",
    leader: "red-500",
    admin: "blue-500"
}




function PeopleCard({displayName, memberId, memberRole, handleUpdateMemberRole}: PeopleCardProps) {
    const {myRole, setMyRole} = useContext(MemberRoleContext)

    const [role, setRole] = useState(memberRole)
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value
        setRole(newRole)
        handleUpdateMemberRole(memberId, newRole)
    }

    console.log(myRole + " PEOPLE CARD");
  return (
    <>
        <div className=' p-10 grid grid-cols-3 text-xl rounded-xl font-bold bg-primary-bg1 shadow-md shadow-black hover:bg-primary-bg2'>
            <span className=''>{displayName} </span>
            <span className={`text-${roleColor[role as keyof typeof roleColor]}`}>{role}</span>
            {role && role !== 'leader' && myRole !== 'member' &&  
                <select name='roles' value={role} onChange={handleChange} className='text-white bg-primary-bg2 rounded-lg p-2 mb-5 hover:bg-primary-bg2 shadow-black shadow-sm'>
                    <option value='member'>Member (View Only)</option>
                    <option value='admin'>Admin (All Access)</option>
                </select>
            }
            {myRole === 'member' && <span>You cannot modify permissions</span>}
        </div>
    </>
  )
}

export default PeopleCard