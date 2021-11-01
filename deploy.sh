#!/bin/bash
version=$1
versionIntro=$2

echo "-gen version"
if [ -z "$version" -o "$version" = "0" ]; then
 date=`date +%y%m%d`
 version=$date
fi
sed -i "s/^.*version:.*,$/version: \'$version\',/g" ./app.js
echo version: $version
echo

echo "-gen versionIntro"
if [ -z "$versionIntro" -o "$versionIntro" = "0" ]; then
 versionIntro='更新'
fi
sed -i "s/^.*versionIntro:.*,$/versionIntro: \'$versionIntro\',/g" ./app.js
echo versionIntro: $versionIntro
echo

echo "-git add"
git add .
echo

echo "-git commit"
git commit -am $versionIntro
echo

echo "-git pull"
git pull
echo

echo "-git push"
git push
echo

echo "-git status"
result=`git status`
echo $result
ck=$(echo $result | grep "nothing to commit, working tree clean")
if [[ "$ck" = "" ]]
then 
	echo -e "\033[31mfail: git有未提交的内容，请检查。";echo -e "\033[0m";
     exit 1
fi

ck=$(echo $result | grep "Your branch is up to date with")
if [[ "$ck" = "" ]]
then 
	echo -e "\033[31mfail: git push失败，请检查。\033[0m"
     exit 1
fi
echo

echo "-wx-cli upload"
commitid=`git rev-parse --short HEAD`
projectPath=`pwd`
if [ 0"$WXIDE_HOME" = "0" ]; then
  echo -e "\033[31mfail: 请先添加系统环境变量WXIDE_HOME，设置为微信开发者工具安装目录\033[0m"
  exit 1
fi
cd "$WXIDE_HOME"
./cli.bat upload --project $projectPath -v $version -d "$commitid-$versionIntro"
cd "$projectPath"
echo

echo -e  "\033[32msuccess\033[0m"