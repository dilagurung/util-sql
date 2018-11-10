/**
 * Created by oa on 11/10/2018.
 */

var gulp = require('gulp');
var db = require('./database');
var fs = require('fs');
var mainDir="./uploads/demo/";
var mainSourceDirImage="../uploads/avatars/";
var logger = require('logger').createLogger(); // logs to STDOUT
var logger = require('logger').createLogger('./error.log');


gulp.task('migrate-image', function (args)
{
    db.query("select distinct user_id from demo_pre",
        {type: db.QueryTypes.SELECT}
    ).then(data =>
    {
        data.map(res=>
        {
            console.log(mainSourceDirImage+res.user_id);
            fs.readdir(mainSourceDirImage+res.user_id, (err, files) => {
                try {
                    files.forEach(file => {
                        if (file.includes("-bpfull")) {
                            updateFileName(res.user_id, file)
                        }
                    });
                }
                catch(ex)
                {
                    console.log(ex);
                }

            })


        });

    }).catch(function (err) {
logger.warn(err);
    });


});



gulp.task('default', function (args) {
//elasticDao.addSuggest('rest','rest');
//    console.log('default');


    db.query("select * from demo_pre where genre_id IS NOT NULL LIMIT 2",
        {type: db.QueryTypes.SELECT}
    ).then(data =>
    {

        data.map(res=>
        {
            var sourceFile='../'+res.path;

            console.log(res.file_name);
            var destinationDir=mainDir+res.user_id;
            if (!fs.existsSync(destinationDir)){
                fs.mkdirSync(destinationDir);
                fileExists(destinationDir,sourceFile,res.file_name);
            }
            else if (fs.existsSync(destinationDir))
            {

                fileExists(destinationDir,sourceFile,res.file_name);

            }




        });

}).catch(function (err) {

        console.log(err);
    });



});


var fileExists=function(dir,file,fileName)
{
console.log(dir, '  ',file,' ',fileName);

    fs.access(file, fs.constants.F_OK, (err) =>
    {

        var flag=(`${file}${err?false:true}`.replace(file,''));
        if(flag=='true')
        {
            fs.createReadStream(file).pipe(fs.createWriteStream(dir+'/'+fileName));

        }
        else
        {
            //console.log('source file doesn\'t exist `${file}`')
        logger.warn(`${file}`)
        }


    });

}

var updateFileName=function(user_id,fileName)
{


    db.query("update users set photo=$photo where user_id=$user_id",
        {bind:{photo:fileName,user_id:user_id},type: db.QueryTypes.UPDATE}
    ).then(data=>{
        console.log(data,' updated.');
    }).catch(function (err) {
        logger.warn(err);
    });

}
gulp.task('test',function (args)
{

    var test="dilaram";
    console.log(test.includes("ram"));

});
