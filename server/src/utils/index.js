import fs from 'fs'

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

const parseSpeech = (speech)=>{
    return (speech || []).reduce((acc,s)=>{
        return `${acc}\n\t[speech]\n\t\t("${s.words}","${s.voice}","${s.rate}","${s.delay}")\n`
    },"");
}

const paramToTuple = (params={})=>{
    return JSON.stringify(params).replace( /[{]/g,"(").replace(/[}]/g,")");
}

const actionToString = (actions, sep='\t\t\t')=>{
    return (actions || []).reduce((acc,a)=>{
        return `${acc}${sep}("${a.action}","${a.delay||0}","${paramToTuple(a.params)}","${a.method||'GET'}")\n`
    },"");
}

const parseActions = (actions, sep='\t\t')=>{
    return (actions || []).reduce((acc,s)=>{
        return `${acc}\n${sep}[action]\n${actionToString(s, `${sep}\t`)}`
    },"");
}

const parseRule  = (rule)=>{
    const actionstr = (rule.actions && rule.actions.length > 0) ? `\n\t\t[actions]${parseActions(rule.actions, '\t\t\t')}`:"";
    return `\n\t[rule]\n\t\t[[${rule.rule.operand}|${rule.next}]]${actionstr}`
} 

const parseRules = (rules)=>{
    return rules.reduce((acc,r)=>{
        return `${acc}${parseRule(r)}`
    },"");
}

const parseOnStart = (onstart)=>{
    return `${parseSpeech(onstart.speech)}\n${parseActions(onstart.actions, '\t')}`
}

const parsePassages = (passages=[])=>{
    return passages.reduce((acc,passage,i)=>{
        const _passage = `[type:${passage.type}]\n[onstart]\n${parseOnStart(passage.onstart)}\n[rules]\n${parseRules(passage.rules)}`
        return `${acc}\n${addSectionHeader(_passage, passage.id, i)}`;
    },"")
}

const parseStory = (story)=>{
    return parsePassages(story.events);
}

const htmlify = (str)=>{
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
const addTwineHeader = (str, name)=>{
    return `<tw-storydata name="${name}" startnode="1" creator="Twine" creator-version="2.4.0-beta2" format="Harlowe" format-version="3.2.3" ifid="B2D98028-16DB-48B4-9F88-01790A7F1750" options=""tags="" zoom="0.6000000000000001" hidden><style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css"></style><script role="script" id="twine-user-script" type="text/twine-javascript"></script><tw-tag name="speech" color="green"></tw-tag><tw-tag name="button" color="blue"></tw-tag>\n${str}</tw-storydata>`
}

const addSectionHeader = (str, name, i)=>{
    return `<tw-passagedata pid="${i+1}" name="${name}" tags="" position="${i%2==0?700:i%3==0?900:500},${100 + (i * 160)}" size="100,100">${htmlify(str)}</tw-passagedata>`
}

const updateOnStartSpeech = (node)=>{
    let lookup = [];
    
    const _node = {
        ...node,
        onstart : {
            ...node.onstart,
            speech: (node.onstart.speech || []).map((speech,i)=>{
               lookup = [...lookup, {[`${node.id}_speech_${i}`]:speech.words}]     
               return {
                    ...speech,
                    audio: `${node.id}_speech_${i}`
                }
            })
        }
    }
   
    return [lookup, _node];
}

const updateOnStartActions = (node)=>{
    let lookup = [];
   
    const _node = {
        ...node,
        onstart : {
            ...(node.onstart ||{}),
            actions: (node.onstart.actions||[]).reduce((acc, actionarr)=>{
                
                return [...acc, (actionarr||[]).map((action,i)=>{
                    
                    if (action.action == "say"){
                        lookup = [...lookup, {[`${node.id}_action_${i}`]:action.params.body.speech.words}]   
                        return {    
                            ...action,
                            audio: `${node.id}_action_${i}`
                        }
                    }
                   
                    return action;
                })]
            },[])
        }
    }
    return [lookup, _node];
}

const updateRules = (node)=>{
    let lookup = [];
   
    const _node = {
        ...node,
        rules: (node.rules||[]).map(r=>{
            return {
                ...r,
                actions: (r.actions||[]).reduce((acc, actionarr)=>{
            
                    return [...acc, (actionarr||[]).map((action,i)=>{
                
                        if (action.action == "say"){
                            lookup = [...lookup, {[`${node.id}_rule_${i}`]:action.params.body.speech.words}]   
                            return {    
                                ...action,
                                audio: `${node.id}_rule_${i}`
                            }
                        }
                        return action;
                    })]
                },[])
            }
        })
    }
    return [lookup, _node];
}

const updateSpeechInNode = (node)=>{
    
    let [_t1, _node]  = updateOnStartSpeech(node)
    let [_t2, _node2] = updateOnStartActions(_node)
    let [_t3, _node3] = updateRules(_node2)

    return {lookup:[..._t1, ..._t2, ..._t3], node:_node3};
    //[_node, lookup]      = updateOnStartAction(node.onstart.actions)
}

const replaceSpeech = (story)=>{
    let lookup = [];

    const nodes =  (story.events||[]).reduce((acc, item)=>{
        const {lookup:_lookup, node} = updateSpeechInNode(item); 
        lookup = [...lookup, ..._lookup];
        return [...acc, node];
    },[])

    if (lookup.length > 0){
        nodes.map(n=>console.log(n.onstart));
    }
    return [lookup, {...story, events:nodes}];
}

export function convertToTwine(obj){
    for (const story of obj){
        fs.writeFileSync(`authored/twine/${story.id}.html`, addTwineHeader(parseStory(story),story.id));
    }
} 

export function renderSpeech(obj){
    for (const story of obj){
        const [torender, replaced] = replaceSpeech(story);
        console.log(story.id);
        console.log(JSON.stringify(torender,null,4));
        console.log(JSON.stringify(replaced,null,4));
    } 
}