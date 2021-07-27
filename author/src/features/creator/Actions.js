import Action from './Action';

export default function Actions({actions=[[]], actionChanged}){

    const _actionChanged = (index, action)=>{
        actionChanged(actions.reduce((acc, item, i)=>{
            if (i === index){
                return [...acc, action];
            }
            return [...acc, item]
        },[]));
    }

    const actionlist = actions.map((a,i)=>{
        return <Action key={i} action={a||[]} actionChanged={(a)=>_actionChanged(i,a)}/>
    })
    return <div>{actionlist}</div>


}