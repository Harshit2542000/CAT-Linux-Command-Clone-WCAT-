#!/usr/bin/env node
//all environment variables run in node environment

const fs=require("fs"); //require imports the file
let arguments=process.argv.slice(2);

let flags=[];
let filenames=[];
let secondaryarguments=[];
let filetowrite=[];
let filestoappend=[];
let bool1=false;
let bool2=false;
for(let i of arguments)
{
    if(i[0]=="-")
    {
        flags.push(i);
        if(i=="-w")
        {
        filetowrite.push(filenames[filenames.length-1]);
        bool1=true;
        }
        if(i=="-a")
        {
            filestoappend.push(filenames[filenames.length-1]);
            bool2=true;
        }
    }
    else if(i[0]==".")
    {
        secondaryarguments.push(i.slice(1));
    }
    else{
        filenames.push(i);
        if(bool1==true)
        {
            filetowrite.push(i);
            bool1=false;
        }
        if(bool2==true)
        {
            filestoappend.push(i);
            bool2=false;
        }
    }
}
// if(flags.length==0)
// {
//     if(filenames.length!=0)
//     {
//       for(let file of filenames)
//       {
//         console.log(fs.readFileSync(file,"utf-8"));
//       }
//    }
// }
// else 
// {
//     for(let flag of flags)
//     {
//         if(flag=="-rs")
//         {
//             for(file of filenames)
//             {
//                 let filedata=fs.readFileSync(file,"utf-8");
//                 console.log((filedata.split(" ")).join(""));
//             }
//         }
//     }
// }
let iswrite=true;
let isappend=true;
for (file of filenames)
{
    let filedata=fs.readFileSync(file,"utf-8");
    for(flag of flags)
    {
        if(flag=="-rs")
        {
            filedata=removeAll(filedata," ");
        }
        if(flag=="-rn")
        {
            filedata=removeAll(filedata,"\r\n");
        }
        if(flag=="-rsc")
        {
            let tempString="";
            for(let character of filedata)
            {
                if((character.charCodeAt(0)>=65 && character.charCodeAt(0)<=90)||(character.charCodeAt(0)>=97 && character.charCodeAt(0)<=122))
                {
                    tempString+=character;
                }
            }
            filedata=tempString;
        }
        if(flag=="-remsc")
        {
            for(let arguments of secondaryarguments)
            {
                filedata=removeAll(filedata,arguments);
            }
        }
        if(flag=="-w" && filetowrite.length==2 && filetowrite[0]!=undefined && iswrite==true )
        {
            let writedata=fs.readFileSync(filetowrite[1],"utf-8");
            fs.writeFileSync(filetowrite[0],writedata);
            filedata=fs.readFileSync(file,"utf-8");
            iswrite=false;
        }
        if(flag=="-a" && filestoappend.length==2 && filestoappend[0]!=undefined &&isappend==true)
        {
            let write1data=fs.readFileSync(filestoappend[0],"utf-8");
            let write2data=fs.readFileSync(filestoappend[1],"utf-8");
            let combined=write1data+"\r\n"+write2data;
            fs.writeFileSync(filestoappend[0],combined);
            filedata=fs.readFileSync(file,"utf-8");
            isappend=false;
        }
        if(flag=="-s") //adding sequence to all lines
        {
            let filedataarray=filedata.split("\r\n");
            let numline=0;
            filedata="";
            for(line of filedataarray)
            {
                 numline++;
                 filedata+=numline+"  "+line+"\r\n";
            }
        }
        if(flag=="-sn")  //adding sequence to non-empty 
        {
            let filedataarray=filedata.split("\r\n");
            let numline=0;
            filedata="";
            for(line of filedataarray)
            {
                if(line!="")
                {
                 numline++;
                 filedata+=numline+"  "+line+"\r\n";
                }
                else{
                    filedata+="\r\n";
                }
            }
        }
        if(flag=="-rel")
        {
            let filedataarray=filedata.split("\r\n");
            let numline=0;
            filedata="";
            for(line of filedataarray)
            {
                if(line!="")
                {
                 numline++;
                 filedata+=numline+"  "+line+"\r\n";
                }
            }
        }
        if(flag=="-relmod")
        {
            let filedataarray=filedata.split("\r\n");
            for(let i=1;i<filedataarray.length;i++)
            {
                if(filedataarray[i]=="" && filedataarray[i-1]=="")
                {
                    filedataarray[i]=null;
                }
                if(filedataarray[i]=="" && filedataarray[i-1]==null)
                {
                    filedataarray[i]=null;
                }
            }
            filedata="";
            for(let i=0;i<filedataarray.length;i++)
            {
                if(filedataarray[i]!=null)
                {
                    filedata=filedata+filedataarray[i]+"\r\n";
                }
            }
        }
    }
    console.log(filedata);
}
function removeAll(string,removaldata)
{
    return string.split(removaldata).join("");
}


